export const mock = (url) => {
  const location = new URL(url)
  location.assign = jest.fn()
  location.replace = jest.fn()
  location.reload = jest.fn()

  Reflect.deleteProperty(global.window, "location")
  Object.defineProperty(window, "location", {
    writable: true,
    value: location
  })
}
