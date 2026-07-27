import EmojiExplorer from "@/components/emoji-explorer";

export const metadata = {
  title: "monochrome-emojis — SVG icon URLs for your README",
  description:
    "Pick an icon, a color, and a size — get a copy-paste-ready markdown embed for GitHub READMEs.",
};

export default function Home() {
  return <EmojiExplorer />;
}