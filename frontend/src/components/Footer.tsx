
function Footer() {

  return (
    <nav className="w-full border-t border-t-[var(--white-08)] bg-[rgba(var(--background),0.5)] bottom-0 fixed h-16">
      <div className="container mx-auto w-full h-full flex justify-between p-4">
        <a href="/" className="flex items-center">
          <img src="/logo/logo_AK.png" alt="" className="h-full pe-4" />
          <p>Akshiro</p>
        </a>

        <a href="https://github.com/Akshiro28/akshiro-img-uploader" target="_blank" rel="noopener noreferrer">
          <img src="/logo/GitHub.png" alt="" className="h-full"/>
        </a>
      </div>
    </nav>
  )
}

export default Footer