<?php

namespace Database\Factories;

use App\Models\Giftcard;
use Illuminate\Database\Eloquent\Factories\Factory;

class GiftcardFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Giftcard::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title'       => $this->faker->words(3, true),
            'label'       => $this->faker->word,
            'description' => $this->faker->paragraph,
            'instruction' => $this->faker->paragraph,
            'value'       => $this->faker->numberBetween(10, 100),
            'currency'    => 'USD'
        ];
    }
}
