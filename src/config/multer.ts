import multer from "multer";

// ===========================================
// CONFIGURACAO DO MULTER - MEMORY STORAGE
// ===========================================
// Usa memoryStorage para manter arquivo em buffer (mais rapido)
// Aceita apenas JPG/PNG, limite de 4MB
// Imagem sera compactada com Sharp antes de enviar ao Cloudinary

export default {
  storage: multer.memoryStorage(),

  // Limite de 4MB
  limits: {
    fileSize: 4 * 1024 * 1024,
  },

  // Aceita apenas JPG e PNG
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    console.log("[MULTER] Processando arquivo:", file.originalname);
    console.log("[MULTER] Tipo:", file.mimetype);

    const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

    if (allowedMimes.includes(file.mimetype)) {
      console.log("[MULTER] Formato aceito!");
      cb(null, true);
    } else {
      console.log("[MULTER] Formato rejeitado!");
      cb(new Error("Formato invalido. Use apenas JPG ou PNG."));
    }
  },
};
