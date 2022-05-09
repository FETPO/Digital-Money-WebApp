<?php

namespace Database\Factories;

use App\Models\GiftcardBrand;
use Illuminate\Database\Eloquent\Factories\Factory;

class GiftcardBrandFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GiftcardBrand::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name'        => $this->faker->company,
            'description' => $this->faker->paragraph
        ];
    }
}
