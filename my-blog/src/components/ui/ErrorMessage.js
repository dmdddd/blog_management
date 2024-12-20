const ErrorMessage = ({ message }) => {
    return (
        message && message.map((error) => (
            <div key={error} className="error">{error}</div>
        ))
    )
  };

  export default ErrorMessage;