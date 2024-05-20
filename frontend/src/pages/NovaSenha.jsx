import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { novoPut } from "../api";

function NovaSenha() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    novoPut('api/users/novasenha', userData)
      .then((response) => {
        console.log(response)
        if (response.data) {
          alert("Senha trocada com sucesso!");
          navigate("/login");
        } else {
          alert("Ocorreu um erro!");
        }
      })
      .catch((error) => {
        alert("Ocorreu um erro!");
      });
  };

  return (
    <>
      <section className="heading">
        <p>Troque sua senha!</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Coloque seu email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Coloque sua nova senha"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Criar nova senha
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default NovaSenha;
