/*
 This file is a part of libertysoil.org website
 Copyright (C) 2017  Loki Education (Social Enterprise)

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import React, { PropTypes } from 'react';

import Message from '../message';

export function PasswordResetForm(props) {
  if (props.success) {
    return (
      <Message>
        If we found this email in our database,
        &span;we have just sent you a message with further steps.
      </Message>
    );
  }

  return (
    <form
      action=""
      className="layout__grid layout__grid-responsive layout-align_end layout__space-double"
      method="post"
      onSubmit={props.onSubmit}
    >
      <div className="layout__grid_item layout__grid_item-identical">
        <label className="label label-before_input" htmlFor="resetPasswordEmail">
          Email
        </label>
        <input
          className="input input-big input-block"
          id="resetPasswordEmail"
          name="email"
          required="required"
          type="email"
        />
      </div>
      <div className="layout__grid_item">
        <button className="button button-big button-green" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

PasswordResetForm.propTypes = {
  onSubmit: PropTypes.func,
  success: PropTypes.bool
};
