

// library to convert price from ETH to CAD


// Price of the ETH in CAD
const eth = 1000;
// Function to convert price from ETH to CAD
const fetchPrice = (price: number) => {
    return price * eth;
    }
    
export default fetchPrice;

