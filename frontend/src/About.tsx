

const About = () => {
    return(
        <div>
            <h1 style={{margin: '10px'}}>
                About
            </h1>
            <p style={{margin: '10px', fontSize: '20px'}}>
                This app is designed to assist with cooking and saving your ingredients.
                If you want to make a dish and are missing ingredients this application will tell 
                you which ingredients you are missing.
            </p>
            <p style={{margin: '10px', fontSize: '20px'}}>
                Future features may include a page that tells you what dishes can be made with the available ingredients, 
                or the dish that can be made with the fewest missing ingredients.
            </p>
        </div>
    )
}

export default About;