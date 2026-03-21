import SettingsPage from '@/presentation/web/pages/Settings/Settings'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | Tense Master",
  description: "Your settings and preferences",
};

export default function Page() {
  return (
    <SettingsPage/>
  );
}
