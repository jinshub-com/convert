import { initializeImageMagick, Magick, ImageMagick, MagickFormat, IMagickImage } from '@imagemagick/magick-wasm';

let imageMagickInitialized: Promise<void> | null = null;

export async function initializeMagick() {
	if (!imageMagickInitialized) {
		const wasmLocation = new URL(`${location.protocol}//${location.host}/magick.wasm`);
		imageMagickInitialized = initializeImageMagick(wasmLocation)
			.then(() => {
				console.log(`ImageMagick initialized. Version: ${Magick.imageMagickVersion}`);
			})
			.catch((err) => {
				console.error(err);
			});
	}
	return imageMagickInitialized;
}

export function getMagickFormat(file: File): MagickFormat {
	const ext = file.name.split('.').pop()?.toLowerCase();
	// convert first letter to uppercase
	const formatName = ext ? ext.charAt(0).toUpperCase() + ext.slice(1) : 'Unknown';
	return (MagickFormat as any)[formatName] || MagickFormat.Unknown;
}

// NOTE: I tried to use promises here, but it will cause the error: "instance is disposed"
export function readMagickImage(file: File, func: (image: IMagickImage) => void): void {
	const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024; // 4GB limit
	if (file.size > MAX_FILE_SIZE) {
		// https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory/Memory
		throw new Error('File is too large');
	}
	const format = getMagickFormat(file);
	const reader = new FileReader();
	reader.onload = async (event) => {
		const arrayBuffer = event.target?.result as ArrayBuffer;
		ImageMagick.read(new Uint8Array(arrayBuffer), format, func);
	};
	reader.readAsArrayBuffer(file);
}

export function downloadImage(data: Uint8Array, filename: string, mimeType = 'image/jpeg') {
	const blob = new Blob([data], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
