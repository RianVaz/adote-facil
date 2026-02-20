import { Animal } from '@prisma/client'
import { Either, Success } from '../../utils/either.js'
import {
  AnimalRepository,
  animalRepositoryInstance,
} from '../../repositories/animal.js'
import { AnimalMapper } from '../../mappers/animal-mapper.js'

export namespace GetUserAnimalsDTO {
  export type Params = {
    userId: string
  }

  export type Failure = { message: string }

  export type Success = { animals: Array<Animal & { images: string[] }> }

  export type Result = Either<Failure, Success>
}

export class GetUserAnimalsService {
  constructor(private readonly animalRepository: AnimalRepository) {}

  async execute(
    params: GetUserAnimalsDTO.Params,
  ): Promise<GetUserAnimalsDTO.Result> {
    const { userId } = params

    const animals = await this.animalRepository.findAllByUserId(userId)

    /*
     * Modificação feita:
     * Substituído o loop manual de formatação de imagens Base64 pelo AnimalMapper.toManyDTO.
     * Isso centraliza a regra de negócio de transformação de dados e remove duplicação
     * entre múltiplos serviços que retornam animais com imagens.
     */
    const formattedAnimals = AnimalMapper.toManyDTO(animals)

    return Success.create({ animals: formattedAnimals })
  }
}

export const getUserAnimalsServiceInstance = new GetUserAnimalsService(
  animalRepositoryInstance,
)
