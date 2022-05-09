<?php

namespace Database\Seeders;

use App\Models\RequiredDocument;
use Illuminate\Database\Seeder;

class RequiredDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RequiredDocument::updateOrCreate([
            'name' => 'Government ID'
        ], [
            'description' => 'Government issued photo ID of your set country is required.',
        ]);

        RequiredDocument::updateOrCreate([
            'name' => 'Business Profile'
        ], [
            'description' => 'If you are a business entity, you are required to submit a detailed description of your business profile.',
        ]);
    }
}
