import { useFolders } from "@/mutations/folders";
import Folder from "./folder";

const Folders = () => {

    const { folders } = useFolders();

    return (
        <div className="flex flex-col gap-1">
            {folders.map(folder => (
                <Folder 
                    key={folder.id} 
                    id={folder.id}
                    name={folder.name}
                />
            ))}
        </div>
    )
}

export default Folders;