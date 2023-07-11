<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tittle = fake()->words(mt_rand(1,3), true);
        return [
            'course' => $tittle,
            'slug' => Str::slug($tittle,'-'),
            'description' => fake()->sentence(10),
            'duration' => fake()->numberBetween(3600,10800),
        ];
    }
}
