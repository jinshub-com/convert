'use client'
import { useEffect, useState } from 'react';
import { FileUpload, FileUploadCover } from './FileUpload';
import { MagickFormat } from '@imagemagick/magick-wasm';
import { downloadImage, getMagickFormat, initializeMagick, readMagickImage } from '@/utils/imageMagickUtils';

const allowedExtensions = ['.heic', '.png', '.jpg', '.jpeg', '.webp', '.tif', '.dng', '.nef', 'arw', '.cr2', '.cr3'];
const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1GB limit

interface SelectedFilesProps {
	files: File[];
}
const SelectedFiles: React.FC<SelectedFilesProps> = (props) => {
	return (
		<div className="inline-block mx-auto">
			<p className="mt-4 font-sm text-gray-600">{props.files.length} {props.files.length > 1 ? 'files' : 'file'} selected</p>
			{
				props.files.map((file, index) => (
					<p key={index} className="text-sm text-gray-600">{file.name}</p>
				))
			}
		</div>
	)
}

interface AnyImage2JpgProps {
	// allowsAlert?: boolean;
}
export const AnyImage2Jpg: React.FC<AnyImage2JpgProps> = (props) => {
	const [files, setFiles] = useState<File[]>([]);

	const onFilesUpdate = (newFiles: File[]) => {
		const allowedFiles = newFiles.filter(file => file.size < MAX_FILE_SIZE);
		if (allowedFiles.length !== newFiles.length) {
			alert('Some files were ignored due to a 1GB file size limit.');
		}
		setFiles([...files, ...allowedFiles]);
	};

	// const onPreview = async () => {
	// 	if (files.length === 0) {
	// 		return;
	// 	}
	// 	const firstFile = files[0];

	// 	await initializeMagick();

	// 	readMagickImage(firstFile, image => {
	// 		console.log('image loaded')
	// 		image.format = MagickFormat.Jpeg;
	// 		image.quality = 60;
	// 		image.write((data: Uint8Array) => {
	// 			const imgElement = document.createElement('img');
	// 			imgElement.src = URL.createObjectURL(new Blob([data], { type: 'image/jpeg' }));
	// 			document.body.appendChild(imgElement);
	// 		})
	// 	});
	// }

	const onConvert = async () => {
		files.forEach(file => {
			readMagickImage(file, image => {
				image.format = MagickFormat.Jpeg;
				image.quality = 80;
				image.write((data: Uint8Array) => {
					downloadImage(data, file.name.replace(/\.[^/.]+$/, '.jpg'));
				})
			});
		});
	}

	useEffect(() => {
		initializeMagick();
	}, [])

	return (
		<div>
			<FileUpload onFilesUpdate={onFilesUpdate} allowsAlert={true} allowedExtensions={allowedExtensions} />
			<div className="mt-4 flex gap-4">
				<SaveButton files={files} onConvert={onConvert} />
			</div>
			<SelectedFiles files={files} />
		</div>
	);
}

export const AnyImage2JpgCover: React.FC = () => {
	return (
		<div className={``}>
			<FileUploadCover allowedExtensions={allowedExtensions} />
			<div className="mt-4 flex gap-4">
				<SaveButton files={[]} onConvert={() => { }} />
			</div>
			<SelectedFiles files={[]} />
		</div>
	)
}

function SaveButton(props: { files: File[], onConvert: () => void }) {
	return (
		<button disabled={props.files.length === 0} onClick={props.onConvert} className="mx-auto disabled:cursor-not-allowed text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save as JPG</button>
	)
}
