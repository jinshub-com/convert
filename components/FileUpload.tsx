'use client'
import { ChangeEventHandler, DragEventHandler, useRef, useState } from 'react';

const fileUploadClasses = "border-4 border-dashed rounded-lg p-8 flex flex-col items-center justify-center"
const fileUploadNonHighlightClasses = "border-gray-300 bg-gray-100"
const FileUploadTip = (props: { allowedExtensions?: string[]; }) => (
	<div className="inline-block mt-auto max-w-md pointer-events-none">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mx-auto">
			<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
		</svg>
		<div className="mt-4 mx-auto">
			<p className="mb-2 text-gray-700">Drag and drop a file here, or click to select a file</p>
			<p className="text-xs text-gray-500">Files converted in-browser for privacy.</p>
			<p className="text-xs text-gray-500 break-all">Allowed file extentions: {(props.allowedExtensions?.length || 0) > 0 ? props.allowedExtensions?.join(',') : 'any'}</p>
		</div>
	</div>
)

interface FileUploadProps {
	allowsAlert?: boolean;
	allowsMultiple?: boolean;
	allowedExtensions?: string[];
	onFilesUpdate: (files: File[]) => void;
}
export const FileUpload: React.FC<FileUploadProps> = (props) => {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const allowsMultiple = props.allowsMultiple === false ? false : true;

	const getAllowedFiles = (filesToBeUpdated: File[]) => {
		const allowedFiles = filesToBeUpdated.filter(file => {
			if (props.allowedExtensions?.length === 0) {
				return true;
			}
			const allowedExtensions = props.allowedExtensions?.map(ext => ext.toLowerCase());
			return allowedExtensions?.includes(`.${file.name.split('.').pop()?.toLowerCase() || ''}`);
		});
		return allowedFiles;
	}

	const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		const droppedFiles = Array.from(e.dataTransfer.files);
		const allowedFiles = getAllowedFiles(droppedFiles);
		if ((allowedFiles.length !== droppedFiles.length) && props.allowsAlert) {
			alert("Some files were ignored because their file extensions are not supported.");
		}
		props.onFilesUpdate(allowedFiles);
	};

	const handleFilesSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
		const selectedFiles = Array.from(e.target.files || []);
		props.onFilesUpdate(selectedFiles);
	};

	return (
		<div
			className={`${fileUploadClasses} ${isDragging ? 'border-purple-500 bg-purple-100' : fileUploadNonHighlightClasses} cursor-pointer`}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onDragOver={(e) => e.preventDefault()}
			onClick={() => fileInputRef.current?.click()}
		>
			<input
				ref={fileInputRef}
				type="file"
				accept={props.allowedExtensions?.join(',') || '*'}
				className="hidden"
				multiple={allowsMultiple}
				onChange={handleFilesSelect}
			/>
			<FileUploadTip allowedExtensions={props.allowedExtensions} />
		</div>
	);
}

type FileUploadCoverProps = Pick<FileUploadProps, 'allowedExtensions'>;
export const FileUploadCover: React.FC<FileUploadCoverProps> = (props) => {
	return (
		<div className={`${fileUploadClasses} ${fileUploadNonHighlightClasses} cursor-not-allowed`}>
			<FileUploadTip allowedExtensions={props.allowedExtensions} />
		</div>
	)
}
