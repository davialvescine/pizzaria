import { v2 as cloudinary } from "cloudinary";

// ===========================================
// CONFIGURACAO DO CLOUDINARY
// ===========================================
// Cloudinary e um servico de armazenamento de imagens na nuvem
// Permite fazer upload, transformar e servir imagens de forma otimizada
// Documentacao: https://cloudinary.com/documentation

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("[CONFIG] Cloudinary configurado");

export { cloudinary };
