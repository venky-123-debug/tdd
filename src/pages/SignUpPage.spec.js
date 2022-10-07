import SignUpPage from "./SignUpPage.svelte"
import { render, screen } from "@testing-library/svelte"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import { setupServer } from 'msw/node'
import { rest } from 'msw'


describe("SignUpPage", () => {

  describe("layout", () => {

    it("has Sign Up header", () => {
      render(SignUpPage)
      const header = screen.getByRole("heading", { name: "Sign Up" })
      expect(header).toBeInTheDocument()
    })

    it("has username input", () => {
      render(SignUpPage)
      const Username = screen.getByLabelText("Username")
      expect(Username).toBeInTheDocument()
    })

    it("has email input", () => {
      render(SignUpPage)
      const Email = screen.getByLabelText("Email")
      expect(Email).toBeInTheDocument()
    })

    it("has email type input", () => {
      render(SignUpPage)
      const input = screen.getByLabelText("Email")
      expect(input.type).toBe("email")
    })

    it("has password input", () => {
      render(SignUpPage)
      const password = screen.getByLabelText("Password")
      expect(password).toBeInTheDocument()
    })

    it("has password type input", () => {
      render(SignUpPage)
      const input = screen.getByLabelText("Password")
      expect(input.type).toBe("password")
    })

    it("has password-repeat input", () => {
      render(SignUpPage)
      const passwordrepeat = screen.getByLabelText("Confirm Password")
      expect(passwordrepeat).toBeInTheDocument()
    })

    it("has password-repeat type input", () => {
      render(SignUpPage)
      const input = screen.getByLabelText("Confirm Password")
      expect(input.type).toBe("password")
    })

    it("has Sign Up Button", () => {
      render(SignUpPage)
      const Button = screen.getByRole("button", { name: "Sign Up" })
      expect(Button).toBeInTheDocument()
    })

    it("has Sign Up Button disabled initially", () => {
      render(SignUpPage)
      const Button = screen.getByRole("button", { name: "Sign Up" })
      expect(Button).toBeDisabled()
    })
  })

  describe("Interactions", () => {

    it("enables the button when password and repeatpassword equals", async () => {
      render(SignUpPage)
      const password = screen.getByLabelText("Password")
      const repeatpassword = screen.getByLabelText("Confirm Password")

      await userEvent.type(password, "P4ssword")
      await userEvent.type(repeatpassword, "P4ssword")

      const Button = screen.getByRole("button", { name: "Sign Up" })
      expect(Button).toBeEnabled()
    })

    it("sends email,username, and password to backend after clicking the button", async () => {
      let requestbody

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestbody = req.body
          return res(ctx.status(200))
        }
      ))
      server.listen()

      render(SignUpPage)
      const username = screen.getByLabelText("Username")
      const email = screen.getByLabelText("Email")
      const password = screen.getByLabelText("Password")
      const repeatpassword = screen.getByLabelText("Confirm Password")
      await userEvent.type(username, "user1")
      await userEvent.type(email, "user1@mail.com")
      await userEvent.type(password, "P4ssword")
      await userEvent.type(repeatpassword, "P4ssword")
      const button = screen.getByRole("button", { name: "Sign Up" })

      await userEvent.click(button)
      server.close()

      expect(requestbody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword"
      })
    })

    it("disables the button when there is an ongoing api call", async () => {
      let requestbody
      let counter = 0

      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter+=1
          requestbody = req.body
          return res(ctx.status(200))
        }
      ))
      server.listen()

      render(SignUpPage)

      const username = screen.getByLabelText("Username")
      const email = screen.getByLabelText("Email")
      const password = screen.getByLabelText("Password")
      const repeatpassword = screen.getByLabelText("Confirm Password")
      const button = screen.getByRole("button", { name: "Sign Up" })

      await userEvent.type(username, "user1")
      await userEvent.type(email, "user1@mail.com")
      await userEvent.type(password, "P4ssword")
      await userEvent.type(repeatpassword, "P4ssword")
      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)

      server.close()
      expect(counter).toBe(1)
    })

    it("displays spinner while the api request is in progress", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestbody = req.body
          return res(ctx.status(200))
        }
      ))
      server.listen()

      render(SignUpPage)
      const username = screen.getByLabelText("Username")
      const email = screen.getByLabelText("Email")
      const password = screen.getByLabelText("Password")
      const repeatpassword = screen.getByLabelText("Confirm Password")
      const button = screen.getByRole("button", { name: "Sign Up" })
      await userEvent.type(username, "user1")
      await userEvent.type(email, "user1@mail.com")
      await userEvent.type(password, "P4ssword")
      await userEvent.type(repeatpassword, "P4ssword")
      await userEvent.click(button)

      const spinner = screen.getByRole("status")

      server.close()
      
      expect(spinner).toBeInTheDocument()

    })

    it("didnt display spinner when there is no api request", async () => {
      render(SignUpPage)
      const spinner = screen.queryByRole("status")
      expect(spinner).not.toBeInTheDocument()
    })

    it("displays account activation after successsful account creation", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200))
        }
      ))
      server.listen()
      render(SignUpPage)
      const username = screen.getByLabelText("Username")
      const email = screen.getByLabelText("Email")
      const password = screen.getByLabelText("Password")
      const repeatpassword = screen.getByLabelText("Confirm Password")
      await userEvent.type(username, "user1")
      await userEvent.type(email, "user1@mail.com")
      await userEvent.type(password, "P4ssword")
      await userEvent.type(repeatpassword, "P4ssword")
      const button = screen.getByRole("button", { name: "Sign Up" })
      await userEvent.click(button)
      server.close()
      const spinner = screen.getByRole("status")


    })

  })


})



