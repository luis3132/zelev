"use client";

import { useParams } from "next/navigation";

const Home = () => {
    const { id } = useParams();
    return(
        <div>
            <h1>categoria: {id}</h1>
        </div>
    )
}

export default Home;