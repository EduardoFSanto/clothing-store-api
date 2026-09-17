import type { CreateCategoryInput } from "./categories.schemas.js";
import { CategoriesRepository } from "./categories.repository.js";

export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findById(id: string) {
    return this.categoriesRepository.findById(id);
  }

  async create(input: CreateCategoryInput) {
    const existingCategory =
      await this.categoriesRepository.findBySlug(input.slug);

    if (existingCategory) {
      throw new Error("A category with this slug already exists");
    }

    return this.categoriesRepository.create({
      name: input.name,
      slug: input.slug,
      active: input.active ?? true,
    });
  }
}