<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Material>
 */
class MaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $material = fake()->words(mt_rand(1,3), true);
        return [
            'course_id' => fake()->numberBetween(1,8),
            'material' => $material,
            'slug' => Str::slug($material, '-'),
            'description' => fake()->sentence(10),
            'embed-link' => 'https://www.youtube.com/watch?v=RqzGzwTY-6w&t=3286s',
        ];
    }
}
