import React, { useState, useEffect, useContext,useRef } from 'react';
import { getDetails, getProductDetails } from '../../services/ManufacturerService';
import AddProduct from "./AddProduct";
import ManDetails from "./ManDetails";
import QueryProduct from "./QueryProduct";
import { BrandContext } from '../../contexts/BrandContext';

const Manufacturer = (props) => {

    const [details, setDetails] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
    const {manufacturerDetails, getManufacturingDetails } = useContext(BrandContext);
    const myRef = useRef(null);

    useEffect(() => {
        getManufacturingDetails();
        scrollToRef(myRef);
    }, []);

    const scrollToRef = ref =>
    ref.current && window.scrollTo(0, ref.current.offsetTop);

    const listProducts = async (brandID) => {
        try {
        const data = await getProductDetails(brandID);
        if (data && data.status && data.status === "SUCCESS") 
        setProductDetails(JSON.parse(data.objectBytes));
        else 
        setProductDetails(null);
        }
        catch(e){
            setProductDetails("");
        }
    }

    const man = JSON.parse(manufacturerDetails ? manufacturerDetails.objectBytes:"0");
    return (
        <div>

            <ManDetails man={man} />
            <QueryProduct ref={myRef} man={man} prodDetails={productDetails} getProducts={listProducts} />


        </div>
    )
}

export default Manufacturer;    