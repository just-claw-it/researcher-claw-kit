import { Chat } from "@/components/chat";
import { SKILL_META } from "@/lib/skills";

const meta = SKILL_META["research-intake"];

export const metadata = {
  title: `${meta.title} | Researcher Kit`,
};

export default function ResearchIntakePage() {
  return (
    <Chat
      skillId="research-intake"
      title={meta.title}
      description={meta.description}
      placeholder={meta.placeholder}
    />
  );
}
