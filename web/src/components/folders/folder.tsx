type Props = {
    id: number;      // will use this later
    name: string;
}

const Folder = ({ name } : Props) => {
    return (
        <div className="px-2 py-1 rounded hover:bg-muted">
            {name}
        </div>
    )
}

export default Folder;