


const ERROR_IMAGES = [
    'Picaze.jpg',
    'Claude.jpg'
]

function get_random_image() {
    let link = ERROR_IMAGES[Math.floor(Math.random() * ERROR_IMAGES.length)];
    return `/error/${link}`
}

export default function Error(props) {
    if (props.TROLL_MODE) {
        return <div className="center" style={{ 
                display: 'flex', 
                flexDirection: "column", 
                alignItems: 'center', 
                justifyContent: "center"
            }}>
            <img src={get_random_image()} alt='' style={{ height: 400, width: "fit-content" }} />
            <b>Une erreur est survenue...</b>
        </div>
    }

    return <div className="center" style={{ 
                display: 'flex', 
                flexDirection: "column", 
                alignItems: 'center', 
                height: 400, 
                justifyContent: "center"
            }}>
            <i className="material-icons red-text" style={{ fontSize: 100}}>cancel</i>
            <b className="center">Une erreur est survenue...</b>
        </div>
}