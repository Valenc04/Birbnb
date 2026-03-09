const getUrlBackend = () => (
    process.env.REACT_APP_BACKEND || 'http://localhost:3000'
)

export default getUrlBackend