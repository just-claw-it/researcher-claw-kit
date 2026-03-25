import { Chat } from "@/components/chat";
import { SKILL_META } from "@/lib/skills";

const meta = SKILL_META["lit-review"];

export const metadata = {
  title: `${meta.title} | Researcher Kit`,
};

export default function LitReviewPage() {
  return (
    <Chat
      skillId="lit-review"
      title={meta.title}
      description={meta.description}
      placeholder={meta.placeholder}
    />
  );
}
