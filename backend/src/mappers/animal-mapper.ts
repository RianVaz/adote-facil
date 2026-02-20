import { Animal, AnimalImage } from '@prisma/client'

export type AnimalWithImages = Animal & { images: AnimalImage[] }

export type AnimalDTO = Animal & { images: string[] }

export class AnimalMapper {
  /**
   * Converte uma entidade de Animal com imagens do banco de dados para um DTO (Data Transfer Object)
   * que contém as imagens no formato Base64, pronto para ser enviado ao frontend.
   * 
   * Essa refatoração centraliza a lógica de mapeamento, eliminando a duplicação em múltiplos serviços
   * e facilitando a manutenção futura (ex: se o formato de armazenamento das imagens mudar).
   */
  static toDTO(animal: AnimalWithImages): AnimalDTO {
    return {
      ...animal,
      images: animal.images.map((image) => {
        return image.imageData.toString('base64')
      }),
    }
  }

  /**
   * Converte uma lista de entidades de Animal para uma lista de DTOs formatados.
   */
  static toManyDTO(animals: AnimalWithImages[]): AnimalDTO[] {
    return animals.map(this.toDTO)
  }
}
