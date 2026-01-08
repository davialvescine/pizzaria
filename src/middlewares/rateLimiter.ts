import rateLimit from "express-rate-limit";

// ===========================================
// RATE LIMITER PARA LOGIN
// ===========================================
// Protege contra ataques de força bruta
// - Máximo 5 tentativas a cada 15 minutos
// - Após 5 falhas, bloqueia por 15 minutos
// - Baseado no IP do cliente
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por janela
  message: {
    error: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
  standardHeaders: true, // Retorna info de rate limit nos headers
  legacyHeaders: false, // Desabilita headers X-RateLimit antigos
  // Só conta tentativas falhas (status >= 400)
  skipSuccessfulRequests: true,
});

// ===========================================
// RATE LIMITER GERAL PARA API
// ===========================================
// Protege contra abusos gerais da API
// - Máximo 100 requisições por minuto
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requisições por minuto
  message: {
    error: "Muitas requisições. Aguarde um momento.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===========================================
// RATE LIMITER PARA REFRESH TOKEN
// ===========================================
// Protege contra abusos do refresh
// - Máximo 10 refreshs a cada 15 minutos
export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 refreshs por janela
  message: {
    error: "Muitas tentativas de refresh. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
