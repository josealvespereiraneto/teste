import { compare } from "bcryptjs";
import { client } from "../../prisma/client";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";
import { GenerateToKenProvider } from "../../provider/GenerateTokenProvider";

interface IRequest {
  email: string;
  password: string;
}

class AuthenticateUserUseCase{
  async execute({ email, password}: IRequest) {
    //verifica se user existe
    const userAlreadyExists = await client.user.findFirst({
      where: {
        email,
      },
    });

    if(!userAlreadyExists) {
      throw new Error("User or password incorrect");
    }
    //verifica se a senha está correta
    const passwordMatch = compare(password, userAlreadyExists.password)

    if(!passwordMatch) {
      throw new Error("User or password incorrect")
    }
    //gerar um token
   const generateToKenProvider = new GenerateToKenProvider();
   const token = await generateToKenProvider.execute(userAlreadyExists.id);

   await client.refreshToken.deleteMany ({
    where: {
      userId: userAlreadyExists.id,
    }
   })
    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(
      userAlreadyExists.id
    );
    return {token, refreshToken};
  }
}

export { AuthenticateUserUseCase}