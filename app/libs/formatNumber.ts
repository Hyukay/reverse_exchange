//this lib is to format number to display it with proper spacing and return it to string


const formatNumber = (value: number) => {
      return  value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "";
      };    

export default formatNumber;
    
      
      
   