import { useFile } from 'swrlit/hooks/things'

export default function PodImage({ src, ...props }) {
  const { data: imageBlob } = useFile(src)
  const imageLocalUrl = imageBlob && URL.createObjectURL(imageBlob)
  return <img src={imageLocalUrl} {...props} />
}
