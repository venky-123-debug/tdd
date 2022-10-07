<script>
  import Axios from "axios"
  let disabled = false
  let password, passwordrepeat, username, email
  $: disabled = password && passwordrepeat ? password != passwordrepeat : true
  let apiProgress = false
  const handlesubmit = () => {
    disabled = true
    apiProgress = true
    Axios.post("/api/1.0/users", { username, email, password })
  };
</script>

<div class="mx-10 mt-10 flex justify-center">
  <div class="w-full lg:w-1/2 shadow-lg rounded-xl bg-emerald-200/50 shadow-xl">
    <form
      class="w-2/3 flex flex-col gap-5 mx-auto"
      on:submit|preventDefault={handlesubmit}
    >
      <h1 class="text-3xl font-bold text-center mt-10">Sign Up</h1>

      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold tracking-wide" for="Username"
          >Username</label
        >
        <input
          class="rounded-lg"
          id="Username"
          type="text"
          bind:value={username}
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold tracking-wide" for="Email"
          >Email</label
        >
        <input class="rounded-lg" id="Email" type="email" bind:value={email} />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold tracking-wide" for="password"
          >Password</label
        >
        <input
          class="rounded-lg"
          id="password"
          type="password"
          bind:value={password}
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold tracking-wide" for="password-repeat"
          >Confirm Password</label
        >
        <input
          class="rounded-lg"
          id="password-repeat"
          type="password"
          bind:value={passwordrepeat}
        />
      </div>

      <div class="flex flex-col gap-2 mx-auto mt-2 mb-8">
        <button
          class="w-28 h-10 flex items-center justify-center pb-1  bg-emerald-500 disabled:bg-emerald-300 text-xl text-white font-semibold rounded-lg"
          {disabled}
        >
            {#if apiProgress}
            <svg
              role="status"
              class="animate-spin h-5 w-5 mr-3 rounded-full border-4 border-white border-r-gray-500"
              viewBox="0 0 24 24"
            />
            {/if}
       

          Sign Up</button
        >
      </div>
    </form>
  </div>
</div>
