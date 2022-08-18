import useSWR from "swr"

export default function useDWCStream() {
  const dwc = useSWR('/api/dweb-camp')
  const addToDWC = async function (resourceUrl, uuidUrn, href) {
    const response = await fetch('/api/dweb-camp', {
      method: 'POST',
      body: JSON.stringify({ resourceUrl, uuidUrn, href }),
    });
    dwc.mutate('/api/dweb-camp');
    return response.json();
  };
  dwc.addToStream = addToDWC;
  dwc.stream = dwc.data
  return dwc
}