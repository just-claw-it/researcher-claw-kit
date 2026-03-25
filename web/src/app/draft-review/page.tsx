import { Chat } from "@/components/chat";
import { SKILL_META } from "@/lib/skills";

const meta = SKILL_META["draft-review"];

export const metadata = {
  title: `${meta.title} | Researcher Kit`,
};

export default function DraftReviewPage() {
  return (
    <Chat
      skillId="draft-review"
      title={meta.title}
      description={meta.description}
      placeholder={meta.placeholder}
    />
  );
}
