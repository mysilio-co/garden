import { useRouter } from "next/router";
import { Demo } from "../demo";

export default function DemoSubpage() {
  const router = useRouter();
  const { subpage } = router.query;
  return <Demo name={subpage}></Demo>;
}
