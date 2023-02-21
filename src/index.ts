import JShare from "./JShare";
import './css/style.scss';



// declare global {
// 	interface Window {
// 		JShare: JShare
// 	}
// }

(window as any).JShare = JShare;
