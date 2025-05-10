import axios from "axios";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import JSZip from "jszip";
import { parseStringPromise } from "xml2js";
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

// Destructure the needed exports
const { getDocument, GlobalWorkerOptions } = pdfjsLib;

// Set the worker to false in Node.js
GlobalWorkerOptions.workerSrc = false;



// Set worker manually for Node.js


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const extractTextFromFile = async (url, fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const response = await fetch(url);
    const buffer = await response.buffer();
  
    switch (extension) {
      case 'pdf': {
        const uint8Array = new Uint8Array(buffer); // 🔥 Convert Buffer to Uint8Array
        const loadingTask = getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;
        let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
       fullText += pageText + '\n\n';
       }

      return fullText;
      }
      case 'docx':
        return (await mammoth.extractRawText({ buffer })).value;
  
      case 'pptx':
        const zip = await JSZip.loadAsync(buffer);
        const slideTexts = [];
      
        const slideFiles = Object.keys(zip.files).filter(name =>
          name.match(/ppt\/slides\/slide[0-9]+\.xml/)
        );
      
        for (const filename of slideFiles) {
          const content = await zip.files[filename].async("string");
          const parsed = await parseStringPromise(content);
          const texts = [];
      
          const shapes = parsed['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'] || [];
      
          shapes.forEach(shape => {
            const paragraphs = shape['p:txBody']?.[0]['a:p'] || [];
            paragraphs.forEach(p => {
              const runs = p['a:r'] || [];
              runs.forEach(r => {
                const text = r['a:t']?.[0];
                if (text) texts.push(text);
              });
            });
          });
      
          slideTexts.push(texts.join(" "));
        }
      
        return slideTexts.join("\n\n");
  
      case 'png':
      case 'jpg':
      case 'jpeg':
        const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
        return text;
  
      case 'txt':
        return buffer.toString();
  
      default:
        return `Unsupported file format: ${fileName}`;
    }
  };
  
  export const processChat = async (req, res) => {
    try {
      const { messages, files } = req.body;

      console.log("Received message:", messages);
        console.log("Received files:", files);
      if (!messages && (!files || files.length === 0)) {
        return res.status(400).json({ error: "No message or files provided." });
      }
      let extractedContent = '';
      for (const file of files) {
        const fileText = await extractTextFromFile(file.url, file.name);
        const extension = file.name.split('.').pop().toLowerCase();
        extractedContent += `\n\nFrom ${extension.toUpperCase()} file "${file.name}":\n${fileText}`;
      }
      
      const updatedMessages = [
        { role: "system", content: "You are Aoun, a helpful academic assistant for university students. You assist with understanding lecture content, summarizing slides, managing deadlines, and providing academic support based on uploaded materials and student tasks. Respond clearly and contextually, based on the student's past messages and uploaded files." },
        ...messages,
      ];
      
      // Append extracted file content if any
      if (extractedContent.trim().length > 0) {
        updatedMessages.push({
          role: "user",
          content: `Analyze the following file content:\n${extractedContent}`,
        });
      }
      
      const payload = {
        model: "gpt-4o",
        messages: updatedMessages,
        temperature: 0.7,
        max_tokens: 500,
      };
      //console.log("Payload sent to OpenAI:", payload);
      console.log("🔍 Context messages:", JSON.stringify(updatedMessages, null, 2));
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ OpenAI response received");
      res.json({ reply: response.data.choices[0].message.content });
    } catch (err) {
      console.error("Error processing chat:", err);
      res.status(500).json({ error: "Failed to process chat" });
    }
  };

  export default processChat;