export async function GET() {
  const contacts = [
    {
      name: "Instagram",
      username: "Bless",
      link: "https://instagram.com",
      icon: "instagram",
      color: "hover:bg-purple-200 hover:text-purple-700",
    },
    {
      name: "WhatsApp",
      username: "+62 889-0113-3932",
      link: "https://wa.me/082224015802",
      icon: "whatsapp",
      color: "hover:bg-green-200 hover:text-green-700",
    },
    {
      name: "Facebook",
      username: "Bless Desain",
      link: "https://facebook.com",
      icon: "facebook",
      color: "hover:bg-blue-200 hover:text-blue-700",
    },
    {
      name: "TikTok",
      username: "Bless.design",
      link: "https://www.tiktok.com",
      icon: "tiktok",
      color: "hover:bg-gray-200 hover:text-gray-700",
    },
    {
      name: "Email",
      username: "Blessdesign25@gmail.com",
      link: "mailto:Blessdesign25@gmail.com",
      icon: "email",
      color: "hover:bg-yellow-200 hover:text-yellow-700",
    },
  ];

  return Response.json(contacts);
}
