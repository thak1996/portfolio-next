export function formatWhatsappUrl(
  phone: string | null | undefined,
  defaultMessage: string = "Olá! Vim pelo seu portfólio e gostaria de conversar sobre um projeto."
): string | null {
  if (!phone) return null;

  // Remove tudo que não for número
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone) return null;

  let finalPhone = cleanPhone;
  // Se o número tiver 10 ou 11 dígitos, provavelmente é do Brasil, então adicionamos o 55
  if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
    finalPhone = `55${cleanPhone}`;
  }

  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(defaultMessage)}`;
}

export function formatEmailUrl(
  email: string | null | undefined,
  subject: string = "Contato via Portfólio",
  body: string = "Olá! Gostaria de conversar sobre um projeto..."
): string | null {
  if (!email) return null;

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
