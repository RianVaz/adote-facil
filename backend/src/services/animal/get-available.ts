import { Animal } from '@prisma/client'
import { Either, Success } from '../../utils/either.js'
import {
  AnimalRepository,
  animalRepositoryInstance,
} from '../../repositories/animal.js'
import { AnimalMapper } from '../../mappers/animal-mapper.js'

export namespace GetAvailableAnimalsDTO {
  export type Params = {
    userId: string
    gender?: string
    type?: string
    name?: string
  }

  export type Failure = { message: string }

  export type Success = { animals: Array<Animal & { images: string[] }> }

  export type Result = Either<Failure, Success>
}

export class GetAvailableAnimalsService {
  constructor(private readonly animalRepository: AnimalRepository) {}

  async execute(
    params: GetAvailableAnimalsDTO.Params,
  ): Promise<GetAvailableAnimalsDTO.Result> {
    const { userId, gender, type, name } = params

    const animals = await this.animalRepository.findAllAvailableNotFromUser({
      userId,
      gender,
      type,
      name,
    })

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

export const getAvailableAnimalsServiceInstance =
  new GetAvailableAnimalsService(animalRepositoryInstance)
