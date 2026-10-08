import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import ListPropertyExperience from "@/components/properties/ListPropertyExperience";

const PROPERTY_MANAGEMENT_ROLES = ["owner", "agent", "hotel_operator", "admin"] as const;

export default async function NewPropertyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();

  if (!session) redirect(`/${locale}/login`);
  if (!(PROPERTY_MANAGEMENT_ROLES as readonly string[]).includes(session.role)) {
    redirect(`/${locale}/dashboard`);
  }

  return <ListPropertyExperience />;
}
