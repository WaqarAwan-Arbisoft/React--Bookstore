import BookSaleCard from "../components/book-sale-card";

const Home = () => {
    return (
        <div >
            <h2 className="text-center my-3">Find the books that you need...!!!</h2>
            <div className="container-fluid d-flex flex-wrap justify-content-center">
                <BookSaleCard />
                <BookSaleCard />
                <BookSaleCard />
                <BookSaleCard />
                <BookSaleCard />
                <BookSaleCard />
            </div>

        </div>

    )
}

export default Home;