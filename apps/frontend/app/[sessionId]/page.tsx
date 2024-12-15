import { ApplicationPage } from "@app/components/pages/application"
import { NextPage } from 'next';

interface PageProps {
  params: {
    sessionId: string;
  };
}
const Page: NextPage<PageProps> = ({ params }) => {
  return <ApplicationPage id={params.sessionId} />
};

export default Page;