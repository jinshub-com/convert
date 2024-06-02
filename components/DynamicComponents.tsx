import dynamic from 'next/dynamic'
import { AnyImage2JpgCover } from './AnyImage2Jpg'

export const importAnyImage2Jpg = () => dynamic(
	() => import('./AnyImage2Jpg')
		.then((mod) => mod.AnyImage2Jpg),
	{
		ssr: false,
		loading: () => <AnyImage2JpgCover />
	}
)
