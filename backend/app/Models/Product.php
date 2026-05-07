<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'category', 'price', 'description',
        'image_path', 'model_path', 'ios_model_path',
        'width', 'height', 'depth',
    ];

    protected $casts = [
        'price'  => 'decimal:2',
        'width'  => 'integer',
        'height' => 'integer',
        'depth'  => 'integer',
    ];

    protected $appends = ['image', 'model', 'ios_model', 'dimensions'];

    public function getImageAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }

    public function getModelAttribute(): ?string
    {
        return $this->model_path ? Storage::url($this->model_path) : null;
    }

    public function getIosModelAttribute(): ?string
    {
        return $this->ios_model_path ? Storage::url($this->ios_model_path) : null;
    }

    public function getDimensionsAttribute(): array
    {
        return [
            'width'  => $this->width,
            'height' => $this->height,
            'depth'  => $this->depth,
        ];
    }
}
