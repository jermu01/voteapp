<?php include_once 'layout/top.inc.php'; ?>
<?php include_once 'layout/nav.inc.php'; ?>

  <div class="container">

  <form name="register">
      <fieldset>
        <legend>Register</legend>
        <div class="form-group">
          <label for="username">Username</label>
          <input name="username" type="text" class="form-control" placeholder="Username">
          </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input name="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <div class="form-group">
          <label for="password">Confirm password</label>
          <input name="confirmpassword" type="password" class="form-control" placeholder="Confrim Password">
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </fieldset>
    </form>
  
</div>

<script src="js/register.js"></script>

<?php include_once 'layout/botto.inc.php'; ?>