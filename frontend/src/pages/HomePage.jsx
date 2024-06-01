import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"

const HomePage = () => {
  const user = useRecoilValue(userAtom);
  return (
    <div>HomePage</div>
  )
}

export default HomePage