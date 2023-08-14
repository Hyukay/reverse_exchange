const formatDate = (timestampInSeconds: number | undefined): string => {
    if (!timestampInSeconds) return "";
  
    const date = new Date(timestampInSeconds * 1000);
    
    const dateString = date.toISOString().split('T')[0];
    
    const timeString = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  
    return `${dateString} ${timeString}`;
  };
  
  
export default formatDate;