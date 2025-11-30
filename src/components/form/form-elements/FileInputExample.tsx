import FileInput from "../input/FileInput";


interface FileInputExampleProps {
  onFileSelect: (file: File) => void;
}

export default function FileInputExample({ onFileSelect }: FileInputExampleProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      onFileSelect(file); // Pass file back to parent
    }
  };

  return (
      <div>
        
        <FileInput onChange={handleFileChange} className="custom-class" />
      </div>
  );
}
